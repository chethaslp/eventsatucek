import { RxLink1 } from "react-icons/rx";
import { FaWhatsapp } from "react-icons/fa";
import { useToast } from "@/components/ui/use-toast";

const ShareButton = ({ date, title, location, type, about, img }: any) => {

  const toast = useToast();
  const copy_message = `${title}
  
${about}

📅 Data: ${date.dayOfWeek}, ${date.day} ${date.month} ${date.year}
⌚ Time: ${date.from_time}
🔹 Type: ${type}
📍 Venue: ${location == "" ? "Will be Updated" : location}
  
🌐 Checkout Now: ${window.location.href}`;

const whatsapp_message = `*${title}*
  
${about}

📅 *Data:* ${date.dayOfWeek}, ${date.day} ${date.month} ${date.year}

⌚ *Time:* ${date.from_time}

🔹 *Type:* ${type}

📍 *Venue:* ${location == "" ? "Will be Updated" : location}
  

🌐 *Checkout Now:* ${window.location.href}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(copy_message);
    toast.toast({
      title: "Copied!",
    });
  };


  return (
    <div className="flex ml-2 gap-2">
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
