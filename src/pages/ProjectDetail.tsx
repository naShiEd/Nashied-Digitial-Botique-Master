import { useParams, Link } from "react-router-dom";
import { projects } from "@/data/projects";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowUpRight, ArrowRight } from "lucide-react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

const ProjectDetail = () => {
    const { slug } = useParams();
    const project = projects.find((p) => p.id === slug);

    if (!project) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center">
                <Navigation />
                <h1 className="text-4xl font-display font-bold mb-4">Project Not Found</h1>
                <Link to="/work">
                    <Button variant="outline">Back to Work</Button>
                </Link>
            </div>
        );
    }

    // Find next project for navigation
    const currentIndex = projects.findIndex((p) => p.id === slug);
    const nextProject = projects[(currentIndex + 1) % projects.length];

    return (
        <div className="min-h-screen bg-background">
            <Navigation />

            {/* Hero Section */}
            <section className="pt-32 pb-12 lg:pt-40 lg:pb-12">
                <div className="container mx-auto px-6">
                    <div className="max-w-7xl mx-auto">
                        <Link to="/work" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors group">
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Back to Projects
                        </Link>

                        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-end">
                            <div>
                                <span className="text-minimal text-accent mb-4 block uppercase tracking-wider">{project.category}</span>
                                <h1 className="text-5xl md:text-7xl font-light text-architectural mb-6">
                                    {project.title}
                                </h1>
                                <p className="text-xl text-muted-foreground max-w-xl">
                                    {project.description}
                                </p>
                            </div>

                            <div className="flex flex-col gap-6 lg:items-end">
                                <div className="grid grid-cols-2 gap-8 text-sm">
                                    <div>
                                        <span className="block text-minimal text-muted-foreground mb-1">YEAR</span>
                                        <span className="block font-medium">{project.year}</span>
                                    </div>
                                    <div>
                                        <span className="block text-minimal text-muted-foreground mb-1">TYPE</span>
                                        <span className="block font-medium">{project.location}</span>
                                    </div>
                                    <div className="col-span-2">
                                        <span className="block text-minimal text-muted-foreground mb-1">DELIVERABLES</span>
                                        <span className="block font-medium">{project.deliverables}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Image Gallery Slider (Featured Position) */}
            <section className="pb-12">
                <div className="max-w-[90rem] mx-auto px-4 md:px-6">
                    {project.images && project.images.length > 0 && (
                        <Carousel
                            opts={{
                                align: "center",
                                loop: true,
                            }}
                            className="w-full"
                        >
                            <CarouselContent>
                                {project.images.map((img, index) => (
                                    <CarouselItem key={index} className="md:basis-1/1 lg:basis-1/1 pl-4">
                                        <div className="p-1">
                                            <div className="rounded-xl overflow-hidden bg-muted/20 shadow-2xl">
                                                <img
                                                    src={img}
                                                    alt={`${project.title} - Asset ${index + 1}`}
                                                    className="w-full h-auto object-cover max-h-[85vh]"
                                                    loading="lazy"
                                                />
                                            </div>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="-left-4 sm:left-12 h-12 w-12 border-2 bg-background/80 backdrop-blur-sm hover:bg-background" />
                            <CarouselNext className="-right-4 sm:right-12 h-12 w-12 border-2 bg-background/80 backdrop-blur-sm hover:bg-background" />
                        </Carousel>
                    )}
                </div>
            </section>

            {/* Project Details Content */}
            <section className="pb-24">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <h3 className="text-2xl font-display font-semibold mb-6">Project Overview</h3>
                        <p className="text-muted-foreground leading-relaxed text-lg">
                            {project.longDescription || project.description}
                        </p>
                        <div className="mt-8">
                            <a
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Button variant="outline" className="font-display">
                                    View on Behance <ArrowUpRight className="ml-2 w-4 h-4" />
                                </Button>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Next Project & CTA */}
            <section className="py-24 border-t border-border bg-muted/20">
                <div className="container mx-auto px-6">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">

                        <div className="text-center md:text-left">
                            <span className="text-minimal text-muted-foreground mb-2 block">NEXT PROJECT</span>
                            <Link to={`/work/${nextProject.id}`} className="group inline-flex items-center">
                                <h2 className="text-3xl md:text-4xl font-display font-bold group-hover:text-accent transition-colors">
                                    {nextProject.title}
                                </h2>
                                <ArrowRight className="ml-4 w-8 h-8 group-hover:translate-x-2 transition-transform text-muted-foreground group-hover:text-accent" />
                            </Link>
                        </div>

                        <div className="text-center md:text-right">
                            <p className="text-muted-foreground mb-4">Ready to start your journey?</p>
                            <Link to="/project-inquiry">
                                <Button variant="outline" className="font-display">
                                    Start a Project
                                </Button>
                            </Link>
                        </div>

                    </div>
                </div>
            </section>

        </div>
    );
};

export default ProjectDetail;
