import { Button, Heading } from "@modules/common/components/ui";
import LocalizedClientLink from "@modules/common/components/localized-client-link";

const Hero = () => {
  return (
    <div className="h-[72vh] w-full border-b border-ui-border-base relative bg-ui-bg-subtle">
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center small:p-32 px-6 gap-6">
        <span className="max-w-3xl">
          <Heading
            level="h1"
            className="text-3xl small:text-5xl leading-10 small:leading-[3.5rem] text-ui-fg-base font-normal"
          >
            Popink Market
          </Heading>
          <Heading
            level="h2"
            className="text-xl small:text-3xl leading-8 small:leading-10 text-ui-fg-subtle font-normal mt-3"
          >
            Tattoo supplies for professional studios in Japan.
          </Heading>
        </span>
        <LocalizedClientLink href="/store">
          <Button variant="secondary">Browse demo catalog</Button>
        </LocalizedClientLink>
      </div>
    </div>
  );
};

export default Hero;
