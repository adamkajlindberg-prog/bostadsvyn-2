import Hero from "./sections/hero"
import About from "./sections/about"
import Properties from "./sections/properties"

const LandingContent = () => {
    return (
        <div className="@container">
            <Hero />
            <About />  
            <div className="bg-nordic-ice py-14 @lg:py-16 px-6 @lg:px-8 @8xl:px-0">
                <Properties /> 
            </div>
        </div>
    )
}

export default LandingContent