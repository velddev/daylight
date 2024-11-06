import { useBackground } from "./useBackground";
import { BackgroundVideo } from "./video";

export const Background = () => {
  const background = useBackground();

  switch (background?.type) {
    case "image":
      return (
        <>
          <div
            className="fixed inset-0 -z-3"
            style={{
              backgroundSize: "cover",
              backgroundImage: `url(${background.url})`,
            }}
          />
          <div className="fixed inset-0 -z-2 bg-black/20" />
        </>
      );
    case "video":
      return <BackgroundVideo asset={background} />;

    default:
      return null;
  }
};
