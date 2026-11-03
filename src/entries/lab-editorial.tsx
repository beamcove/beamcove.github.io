// mountLab first, so the design system's CSS loads before the site's own.
import { mountLab } from "@/lab/mount-lab";
import { EditorialSite } from "@/lab/editorial/editorial-site";

mountLab(<EditorialSite />);
