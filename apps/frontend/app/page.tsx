import { Appbar }  from "@/components/Appbar";
import { Prompt } from "@/components/Prompt";
import {ProjectsDrawer} from "@/components/ProjectDrawer";
import SideInfo from "@/components/SideInfo";

export default function Home() {
    return (
        <>
            <Appbar />
            <ProjectsDrawer />
            <Prompt />
            <SideInfo />
        </>
    );
}