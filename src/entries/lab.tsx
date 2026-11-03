// mountLab first, so the design system's CSS loads before the page's own.
import { mountLab } from "@/lab/mount-lab";
import { LabIndexPage } from "@/lab/lab-index";

mountLab(<LabIndexPage />);
