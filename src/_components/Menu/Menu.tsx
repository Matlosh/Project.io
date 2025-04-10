import { redirect } from "react-router";
import { menuLinks } from "../../_utils/links.jsx";

export function Menu() {
  return (
    <view className="w-full h-[60px] bg-dark-400 mt-auto flex flex-row items-between">
      {menuLinks.map(link => (
        <text bindtap={() => console.log(link.url)}>{link.name}</text>
      ))}
    </view>
  );
}