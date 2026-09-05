import logo from "@/public/logo/black/warrior-face.png"
import { Card } from "../ui/card"
import Image from "next/image"

export default function KoaCard() {
  return (
    <Card className="flex flex-col gap-2 p-3 items-center">
      <h3 className="text-xl font-bold mb-2 w-full text-start">KOA</h3>
      <Image src={logo} alt={"KOA logo"} height={130} loading="eager" />
      <p className="text-gray-950 font-semibold mb-4 w-full text-center">
        Premium activewear for warriors. Performance. Style. Attitude.
      </p>
      <div className="flex gap-6 items-center">
        <a href="https://www.facebook.com/koa" className="hover:text-[#3D79BE] transition">
          <Image src={"/icons/social-media/facebook-black.svg"} alt='Facebook Logo' height={30} width={30} />
        </a>
        <a href="https://www.instagram.com/koa" className="hover:text-[#3D79BE] transition">
          <Image src={"/icons/social-media/instagram-black.svg"} alt='Instagram Logo' height={30} width={30} />
        </a>
        <a href="https://www.tiktok.com/koa" className="hover:text-[#3D79BE] transition">
          <Image src={"/icons/social-media/tiktok-black.svg"} alt='TikTok Logo' height={30} width={30} />
        </a>
        <a href="https://www.facebook.com/koa" className="hover:text-[#3D79BE] transition">
          <Image src={"/icons/social-media/whatsapp-black.svg"} alt='WhatsApp Logo' height={30} width={30} />
        </a>
      </div>
    </Card>
  )
}