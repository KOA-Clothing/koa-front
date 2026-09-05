import { Hero } from "@/components/shop-front/hero";

export default function Home() {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <Hero /> 
      <div className="h-100 flex flex-col items-center max-w-full w-7xl justify-center border border-red-500">
        Content
      </div>
    </div>
  )
}