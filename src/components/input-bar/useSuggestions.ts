import OpenAI from "openai";
import { useSettings } from "../../providers/SettingsProvider";
import { useMemo } from "react";

const typeOrder = {
  answer: 0,
  link: 1,
  reword: 2,
  completion: 3,
};

export type Suggestion =
  | {
      type: "answer" | "completion" | "reword";
      content: string;
    }
  | {
      type: "link";
      content: string;
      url: string;
    };

export const useSuggestions = () => {
  const settings = useSettings();

  const openai = useMemo(() => {
    if (!settings?.keys.openai) return null;

    return new OpenAI({
      apiKey: settings?.keys.openai,
      dangerouslyAllowBrowser: true,
    });
  }, [settings?.keys.openai]);

  return {
    getSuggestions: async (
      search: string,
      abortController: AbortController
    ): Promise<Suggestion[]> => {
      if (openai === null) return [];
      if (search.length < 3) return [];

      const stream = await openai.chat.completions.create(
        {
          model: "gpt-4-turbo",
          messages: [
            {
              role: "user",
              content: `You are a search engine completion system. Your job is to give at most 5 completions for the incoming search queries.
              
              Here are some rules:
              1. If the search query is a question, add the answer to the question first. Answers must at least be 50 letters.
              2. You can recommend websites directly. please prefix your completion with "url:" if you want to recommend a website. Only use links if you are 100% sure that the link is relevant and valid.
              3. You can reword the search query. please prefix your completion with "reword:" if you want to reword the search query.
              4. Completions cannot answer the question, they can only autocomplete the search query.
              5. Every result needs to be on a new line with no formatting such as numbers or bullets. In no exception can you use a new line anywhere else.
            
            complete: ${search}`,
            },
          ],
          temperature: 0.1,
        },
        {
          signal: abortController.signal,
        }
      );

      const suggestions =
        stream.choices[0]?.message?.content
          ?.split("\n")
          .filter(Boolean)
          .map((v) => parseSuggestion(v, search)) ?? [];

      suggestions.sort((a, b) => typeOrder[a.type] - typeOrder[b.type]);
      return suggestions;
    },
  };
};

const parseSuggestion = (str: string, query: string): Suggestion => {
  if (str.startsWith("url:")) {
    const content = str.slice(4);
    let url = content.split(" ")[0];
    if (!url.startsWith("https://")) {
      url = "https://" + url;
    }

    return {
      type: "link",
      content,
      url,
    };
  }

  if (str.length > 50) {
    return {
      type: "answer",
      content: str,
    };
  }

  if (str.startsWith("reword:")) {
    return {
      type: "reword",
      content: str.slice(7),
    };
  }

  return {
    type: "completion",
    content: str.startsWith(query) ? str.slice(query.length) : str,
  };
};
