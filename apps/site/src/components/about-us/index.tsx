import ContainerWrapper from "@/components/common/container-wrapper"
import Hero from "./sections/hero"
import OurValues from "./sections/our-values"
import SecurityCompliance from "./sections/security-compliance"
import LegalDocuments from "./sections/legal-documents"
import BrowseMore from "./sections/browse-more"

const AboutUs = () => {
    return (
        <div className="@container">
            <ContainerWrapper className="py-10">
                <Hero />
                <OurValues />
                <SecurityCompliance />
                <LegalDocuments />
                <BrowseMore />
            </ContainerWrapper>
        </div>
    )
}

export default AboutUs