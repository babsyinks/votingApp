import { v4 as uuidv4 } from "uuid";
import {
  Shield,
  ShieldCheck,
  Clock,
  Users,
  LayoutDashboard,
  BarChart3,
  User2,
  Timer,
  Vote,
  Key,
  LayoutList,
  FormInput
} from "lucide-react";

const mapContents = (arr) =>
  arr.map((item) => ({
    id: uuidv4(),
    ...item,
  }));

const contents1 = [
  {
    icon: Shield,
    title: "Transparent voting process",
    description:
      "Every vote is tracked securely and transparently, ensuring optimal integrity of the process.",
  },
  {
    icon: Vote,
    title: "Real-time vote counting",
    description:
      "Votes are counted instantly with live updates for accuracy, ensuring user trust in the process.",
  },
  {
    icon: Key,
    title: "Secure access",
    description:
      "Only eligible voters can cast ballots with robust verification. Admin sets the list of eligible electors.",
  },
  {
    icon: LayoutList,
    title: "User-friendly interface",
    description:
      "Simple, intuitive design makes voting quick and stress-free. The process is seamless irrespective of the device used.",
  },
  {
    icon: Clock,
    title: "Flexible election periods",
    description:
      "Set custom election start and end times that suit your organization. You determine the election duration.",
  },
  {
    icon: User2,
    title: "Anonymity",
    description:
      "Eligible voters can vote for candidates of their choice without worrying about it being revealed. Votes are private.",
  },
];

const contents2 = [
  {
    icon: BarChart3,
    title: "Real-time voting statistics",
    description:
      "Track participation and results as they happen. You get to see how your vote impacts the election.",
  },
  {
    icon: Users,
    title: "Candidate profiles",
    description:
      "Review manifestos and candidate details before voting, ensuring you make an informed decision before voting.",
  },
  {
    icon: ShieldCheck,
    title: "Prevention of double voting",
    description:
      "Each voter can only cast their ballot once, no exceptions! Ensures 'one-person one-vote' principle is upheld.",
  },
  {
    icon: LayoutDashboard,
    title: "Results dashboard",
    description:
      "Access a clear summary of outcomes in a modern dashboard. On conclusion of the election, results are instantly displayed.",
  },
  {
    icon: Timer,
    title: "Countdown timers",
    description:
      "Stay informed with automatic election timers: election-start countdown timer and election-end countdown timer.",
  },
  {
    icon: FormInput,
    title: "Multiple Modes",
    description:
      "You can have a dry-run election with dummy contestants in demo mode before having the real election in live mode.",
  },
];

const items = {
  expect: {
    title: "What You Can Expect",
    contents: mapContents(contents1),
  },
  features: {
    title: "Features of VoteNow",
    contents: mapContents(contents2),
  },
};

export default items;
