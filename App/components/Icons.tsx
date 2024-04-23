import {
  Check,
  ChevronDown,
  ChevronUp,
  Info,
  LucideIcon,
  MoonStar,
  Sun,
} from "lucide-react-native";
import { cssInterop } from "nativewind";

function interopIcon(icon: LucideIcon) {
  cssInterop(icon, {
    className: {
      target: "style",
      nativeStyleToProp: {
        color: true,
        opacity: true,
      },
    },
  });
}

interopIcon(Info);
interopIcon(MoonStar);
interopIcon(Sun);
interopIcon(ChevronDown);
interopIcon(ChevronUp);
interopIcon(Check);

export { Info, MoonStar, Sun, ChevronDown, ChevronUp, Check };