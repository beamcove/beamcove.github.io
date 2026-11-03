// mountLab first, so the design system's CSS loads before the site's own.
import { mountLab } from "@/lab/mount-lab";
import { CinemaSite } from "@/lab/cinema/cinema-site";

mountLab(<CinemaSite />);
