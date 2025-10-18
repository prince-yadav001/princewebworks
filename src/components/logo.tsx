import { Briefcase } from "lucide-react";
import Link from "next/link";
import type { FC } from "react";

const Logo: FC = () => {
  return (
    <Link href="/" className="flex items-center gap-2" prefetch={false}>
      <Briefcase className="h-6 w-6 text-primary" />
      <span className="font-bold text-lg font-headline">PrinceWebWork</span>
    </Link>
  );
};

export default Logo;
