import Hero from "./sections/hero"
import About from "./sections/about"
import Properties from "./sections/properties"

const LandingContent = () => {
    return (
        <div className="@container">
            <Hero />
            <About />  
            <Properties /> 
        </div>
    )
}

export default LandingContent