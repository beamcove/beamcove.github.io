// mountLab first, so the design system's CSS loads before the site's own.
import { mountLab } from "@/lab/mount-lab";
import { BentoSite } from "@/lab/bento/bento-site";

mountLab(<BentoSite />);
