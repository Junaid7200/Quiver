import Image from "next/image"
import HeaderButtons from './components/LandingPageNavBar';

export default function indexPage() {
    return (
        <div className="w-full flex flex-col bg-black">
            <header className="bg-[#09090B] w-[100%] h-[70px] flex justify-between items-center px-[40px]">
                <div className="flex mt-[15px] items-center">
                    <Image src="/Assets/quiver-logo.png" alt='Quiver' width={50} height={50} className="mr-[10px]"/>
                    <p className="text-[28px]">Quiver</p>
                </div>
                <HeaderButtons className="mt-[15px]"/>
            </header>
            <div className="UpperSection pl-[80px] pr-[80px] bg-black my-[96px] w-full flex items-center justify-between">
                <div className=" text mr-[80px] w-[625px]">
                    <div className="w-[100%] h-[296px] pt-[27px]">
                        <div><p className="text-white text-6xl font-bold">Aim.</p></div>
                        <div><p className="text-[#EC615B] text-6xl font-bold ml-[18%]">Note.</p></div>
                        <div><p className="text-[#5222D0] text-6xl font-bold ml-[39%]">Navigate.</p></div>
                    </div>
                    <div className="w-[100%] text-gray-700">
                        <p className="w-[100%]">Our mission is to offer dynamic AI-based assessments to determine scholarship eligibility and empower students with valuable insights.</p>
                    </div>
                </div>
                <div className="Image">
                    <Image src="/Assets/landingPage.svg" width={596} height={446}></Image>
                </div>
            </div>
            <div className="midSection">

            </div>
            <div className="lowerSection">

            </div>
        </div>
    )
}