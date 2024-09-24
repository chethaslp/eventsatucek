import { RxLink1 } from "react-icons/rx";
import { FaWhatsapp } from "react-icons/fa";
import { useToast } from "@/components/ui/use-toast";

const ShareButton = ({ date, time, title, location, type, about}: any) => {

  const toast = useToast();
  const copy_message = `${title}
  

📅 ${date} at ${time}
📍 Venue: ${location == "" ? "Will be Updated" : location}

🌐 View More at: ${window.location.href}

${about}`

const whatsapp_message = `*${title}*
  
📅 ${date} at ${time}
📍 Venue: ${location == "" ? "Will be Updated" : location}
  
🌐 *View More at:* ${window.location.href}

${about}`
  const handleCopy = async () => {
    await navigator.clipboard.writeText(copy_message);
    toast.toast({
      variant:'default',
      title: "Copied!",
    });
  };

  const handleShare = async (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    event.preventDefault();

    // Check if the Web Share API is supported
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Used car price predictor",
          text: "Check out this amazing ML model which predicts used car price",
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      console.error("Web Share API is not supported in this browser.");
    }
  };



  return (
    <div className="flex ml-2 gap-2" >
      <RxLink1 className="w-5 h-5 cursor-pointer" onClick={handleCopy} />
      <a
        href={`whatsapp://send?text=${encodeURIComponent(whatsapp_message)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaWhatsapp className="w-5 h-5" />
      </a>
    </div>
  );
};
export default ShareButton;
