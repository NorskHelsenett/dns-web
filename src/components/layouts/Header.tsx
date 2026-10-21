import { Fragment } from "react/jsx-runtime";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../ui/breadcrumb";
import UserBox from "./UserBox";

interface BreadcrumbElement {
  title: string;
  url: string;
}

interface HeaderProps {
  breadcrumbs: BreadcrumbElement[];
}

export default function Header({ breadcrumbs }: HeaderProps) {
  return (
    <div className="w-full h-20 bg-white flex justify-between items-center px-6">
        {/* TODO: Breadcrumbs might break with subpages */}
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map(({ title, url }, index) => {
            const isLast = index === breadcrumbs.length - 1;

            return (
              <Fragment key={url}>
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{title}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink render={<a href={url}>{title}</a>} />
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator />}
              </Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
      <UserBox />
    </div>
  );
}