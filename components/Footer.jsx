import Link from "next/link";

export default function Footer() {
  return (
    <div className="bg-black flex justify-between items-center">
      <div>Gatify</div>
      <div>
        <p>anshsaxena4190@gmail.com</p>
        <p>sarthakvaish@something.com</p>
      </div>

      <Link href="https://github.com/anshss/Gatify">
        <div className="flex flex-row gap-2">
          <img src="./github.svg"></img>
          <p>Star us</p>
        </div>
      </Link>
    </div>
  );
}
