import ContainerWrapper from "@/components/common/container-wrapper"
import Hero from "./sections/hero"
import Projects from "./sections/projects"
import Advantages from "./sections/advantages"
import GetProjects from "./sections/get-projects"

const NewProduction = () => {
    return (
        <div className="@container">
            <ContainerWrapper className="py-10">
                <Hero />
                <Projects />
                <Advantages />
                <GetProjects />
            </ContainerWrapper>
        </div>
    )
}

export default NewProduction