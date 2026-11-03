// mountLab first, so the design system's CSS loads before the site's own.
import { mountLab } from "@/lab/mount-lab";
import { PosterSite } from "@/lab/poster/poster-site";

mountLab(<PosterSite />);
