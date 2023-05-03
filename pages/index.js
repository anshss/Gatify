import animationData from "../assets/lottie/animation-1.json";
import Lottie from "react-lottie";
import { useRouter } from "next/router";
import Footer from "@/components/Footer";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

export default function Home() {
	const router = useRouter()
  return (
    <div className="min-h-screen">
      <div className="hero-wrapper pb-10 relative">
        <div className="relative mt-8 flex flex-1 flex-col justify-end overflow-hidden rounded-[36px] p-8 px-12">
          <div className="hero-bg absolute inset-0 -z-10 rounded-[36px] bg-gel-black md:block [&>div]:absolute [&>div]:inset-0 [&>div]:rounded-[36px]"></div>
          {/**/}
          <h1 className="hero-title lg:leading[72px] leading-[52px] tracking-[-1.5px] md:leading-[60px] lg:tracking-[-4.5px] pt-40">
            <span className="gel-gradient-text-peach inline-block pr-[4px] pb-1">
              Web3’s
              <br />
              gated{" "}
              <br className="xs:hidden sm:hidden md:inline-block lg:inline-block" />{" "}
              community
            </span>
          </h1>
          <p className="hero-text mb-8">
            <span>
              Gatify is a plateform for creating communities <br /> that are
              only accessible by those you authorize.
            </span>
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 md:flex-row">
            <button
				onClick={() => router.push("/host")}
              id="mainpage-cover-cta-1"
              className="hero-button px-8 solid-gradient gradient-peach w-full md:w-auto text-black"
            >
              <span className="relative z-10 text-[#202020]">Start Hosting</span>
            </button>
            {/* <a
              href="/developers"
              className="hero-button solid-gradient gradient-peach outlined w-full md:w-auto"
              id="mainpage-cover-cta-2"
            >
              <span className="relative z-10">&gt; Start Building</span>
            </a> */}
          </div>
        </div>
        <div className="absolute right-20 top-14">
          <Lottie options={defaultOptions} height={500} width={550} />
        </div>
      </div>
      <Footer />
    </div>
  );
}
