// mountLab first, so the design system's CSS loads before the site's own.
import { mountLab } from "@/lab/mount-lab";
import { GridSite } from "@/lab/grid/grid-site";

mountLab(<GridSite />);
