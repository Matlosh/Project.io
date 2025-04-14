import { useNavigate } from "react-router";
import { menuLinks } from "../../_utils/links.jsx";

export function Menu() {
  let navigate = useNavigate();

  return (
    <view className="w-full h-[60px] bg-dark-400 mt-auto flex flex-row items-between">
      {menuLinks.map(link => (
        <text
          bindtap={() => navigate(link.url)}
          className="text-white">{link.name}</text>
      ))}
    </view>
  );
}