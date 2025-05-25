import Image from "next/image"

export default function indexPage() {
    return (
        <div className="bg-black my-[96px] ">
            <div className="UpperSection pl-[80px]">
                <div className=" text mr-[80px] w-[644px]">
                    <div className="w-[100%] h-[296px] pt-[27px]">
                      <div><p className="text-white text-5xl font-bold">Aim.</p></div>
                    <div><p className="text-[EC615B] text-5xl font-bold">Note.</p></div>
                    <div><p className="text-[5222D0] text-5xl font-bold">Navigate.</p></div>
                    </div>
                    <div className="w-[644px]">
                        <p classname="w-[100%]">Our mission is to offer dynamic AI-based assessments to determine scholarship eligibility and empower students with valuable insights.</p>
                    </div>
                </div>
                <div className="Image">
                    <Image></Image>
                </div>
            </div>
            <div className="midSection">
                
            </div>
            <div className="lowerSection">

            </div>
        </div>
    )
}