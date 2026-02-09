import { Hero } from '../components/hero';
import { About } from '../components/about';
import { Initiatives } from '../components/initiatives';
import { Impact } from '../components/impact';
import { Blog } from '../components/blog';
import { Contact } from '../components/contact';

export function Home() {
    return (
        <>
            <Hero />
            <About />
            <Initiatives />
            <Impact />
            <Blog />
            <Contact />
        </>
    );
}
