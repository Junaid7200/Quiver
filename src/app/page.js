import Image from "next/image"
import HeaderButtons from './components/LandingPageNavBar';

export default function indexPage() {
    return (
        <div className="w-full flex flex-col bg-black">
            <header className="bg-[#09090B] w-[100%] h-[70px] flex justify-between items-center px-[40px] border-b border-solid border-[#E3DEED]">
                <div className="flex h-[100%] items-center">
                    <Image src="/Assets/quiver-logo.png" alt='Quiver' width={50} height={50} className="mr-[10px]"/>
                    <p className="text-[28px]">Quiver</p>
                </div>
                <HeaderButtons/>
            </header>
            <div className="UpperSection pl-[80px] pr-[80px] bg-black my-[96px] w-full flex items-center justify-between">
                <div className=" text mr-[70px] w-[60%]">
                    <div className="w-[100%] pt-[27px]">
                        <div><p className="text-white text-8xl font-bold">Aim.</p></div>
                        <div><p className="text-[#EC615B] text-8xl font-bold ml-[20%]">Note.</p></div>
                        <div><p className="text-[#5222D0] text-8xl font-bold ml-[43%]">Navigate.</p></div>
                    </div>
                    <div className="w-[100%] text-gray-700 pt-[5%]">
                        <p className="w-[100%] text-2xl">Our mission is to offer dynamic AI-based assessments to determine scholarship eligibility and empower students with valuable insights.</p>
                    </div>
                </div>
                <div className="Image w-[40%]">
                    <Image src="/Assets/landingPage.svg" width={650} height={446} alt='Girl painting on a big screen in front of her'></Image>
                </div>
            </div>
            <div className="midSection">

            </div>
            <div className="lowerSection">

            </div>
        </div>
    )
}