import { MdEngineering, MdLeaderboard, MdOutlineSell, MdAnalytics, MdCreate, MdGroup, MdGavel } from "react-icons/md";
import { SiWeb3Dotjs } from "react-icons/si";
import { TbChartScatter } from "react-icons/tb";
import { FaMagic } from "react-icons/fa";
import { SiFreelancer } from "react-icons/si";

export const skills = [
  { title: "Software Engineering", description: "Develop technical skills.", icon: <MdEngineering size={30} />, category: "software-engineering" },
  { title: "Leadership", description: "Learn to lead effectively.", icon: <MdLeaderboard size={30} />, category: "leadership" },
  { title: "Analytical", description: "Develop analytical thinking.", icon: <MdAnalytics size={30} />, category: "analytical" },
  { title: "Creative", description: "Boost your creativity.", icon: <MdCreate size={30} />, category: "creative" },
  { title: "Interpersonal", description: "Improve interpersonal skills.", icon: <MdGroup size={30} />, category: "interpersonal" },
  { title: "Artificial Intelligence", description: "Develop your AI skills.", icon: <FaMagic size={30} />, category: "artificial-intelligence" },
  { title: "Data Science", description: "Learn or improve your DS skills", icon: <TbChartScatter size={30} />, category: "data-science" },
  { title: "Negotiation", description: "Negotiate successfully.", icon: <MdGavel size={30} />, category: "negotiation" },
  { title: "Artistic", description: "Improve your artistic skills.", icon: <SiFreelancer size={30} />, category: "artistic" },
  { title: "Marketing", description: "Master the marketing skills", icon: <MdOutlineSell size={30} />, category: "marketing" },
  { title: "Web3", description: "Learn about Web3 technologies.", icon: <SiWeb3Dotjs size={30} />, category: "web3" },
];