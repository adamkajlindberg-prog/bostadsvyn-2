import { XIcon } from "lucide-react";
import { useEffect } from "react";
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
  useReactCompareSliderRef,
} from "react-compare-slider";
import { useModalStore } from "@/stores/use-modal-store";

export const modalKey = `image-full-modal`;

type T_Props = {
  beforeImage: string;
  afterImage: string;
};

const ImageFullModal = ({ beforeImage, afterImage }: T_Props) => {
  const { modal, setModal } = useModalStore((state) => state);
  const reactCompareSliderRef = useReactCompareSliderRef();

  const handleClose = () => setModal(null);

  useEffect(() => {
    if (modal === modalKey) {
      document.body.style.overflow = "hidden";

      const fireTransition = async () => {
        await new Promise((resolve) =>
          setTimeout(() => {
            reactCompareSliderRef.current?.setPosition(90);
            resolve(true);
          }, 750),
        );
        await new Promise((resolve) =>
          setTimeout(() => {
            reactCompareSliderRef.current?.setPosition(10);
            resolve(true);
          }, 750),
        );
        await new Promise((resolve) =>
          setTimeout(() => {
            reactCompareSliderRef.current?.setPosition(50);
            resolve(true);
          }, 750),
        );
      };

      fireTransition();
    }
  }, [modal, reactCompareSliderRef.current?.setPosition]);

  if (modal !== modalKey) return null;

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center min-h-[100dvh] w-screen">
      <div className="py-1.5 px-3 bg-black/20 absolute top-0 left-0 w-full flex justify-end z-10">
        <button
          type="button"
          className="text-primary-foreground hover:opacity-70 cursor-pointer"
          aria-label="Close"
          onClick={handleClose}
        >
          <XIcon size={24} />
        </button>
      </div>

      <ReactCompareSlider
        ref={reactCompareSliderRef}
        itemOne={
          <ReactCompareSliderImage
            src={beforeImage}
            alt="Originalbild"
            className="max-h-[90dvh] max-w-[90vw] object-contain"
          />
        }
        itemTwo={
          <ReactCompareSliderImage
            src={afterImage}
            alt="AI-bild"
            className="max-h-[90dvh] max-w-[90vw] object-contain"
          />
        }
        position={50}
        transition=".75s ease-in-out"
      />
    </div>
  );
};

export default ImageFullModal;
