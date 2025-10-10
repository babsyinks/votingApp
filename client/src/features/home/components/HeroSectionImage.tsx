import Img from "components/ui/Img";
import heroImage from "assets/images/vote-hero.png";

export default function HeroSectionImage() {
  return (
    <>
      <Img className="border-rounded-1r" src={heroImage} alt="Voting illustration" />
    </>
  );
}
