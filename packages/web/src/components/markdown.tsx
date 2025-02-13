import { evaluateSync } from "@mdx-js/mdx";
import React, { useMemo } from "react";

import { ArtifactPreview } from "./artifact-preview";

export function Markdown({ content }: { content: string }) {
  return useMemo(() => {
    const elements: JSX.Element[] = [];
    const lines = content.split("\n\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      try {
        const { default: Component } = evaluateSync(line, {
          Fragment: React.Fragment,
          jsx: React.createElement,
          jsxs: React.createElement,
          useMDXComponents: () => components,
        });
        elements.push(<Component key={i} />);
      } catch {
        continue;
      }
    }
    return elements;
  }, [content]);
}

const components = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="text-2xl font-bold" {...props} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="text-xl font-bold" {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="text-lg font-bold" {...props} />
  ),
  h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4 className="text-md font-bold" {...props} />
  ),
  h5: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h5 className="text-sm font-bold" {...props} />
  ),
  h6: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h6 className="text-xs font-bold" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="leading-relaxed" {...props} />
  ),
  a: (props: React.HTMLAttributes<HTMLAnchorElement>) => (
    <a className="text-blue-500" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="list-disc space-y-1 py-2 pl-4" {...props}>
      {props.children}
    </ul>
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="list-decimal pl-4" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="leading-relaxed" {...props} />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code
      className="rounded-sm border bg-muted p-1 text-sm text-primary"
      {...props}
    />
  ),
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre
      className="rounded-sm border bg-muted p-1 text-sm text-primary"
      {...props}
    />
  ),
  img: (props: React.HTMLAttributes<HTMLImageElement>) => (
    <img className="w-full" {...props} />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="border-l-2 border-gray-300 pl-4" {...props} />
  ),
  Artifact: ArtifactPreview,
};

function transform<T extends React.PropsWithChildren>(
  Component: React.ComponentType<T>,
): React.ComponentType<T> {
  const TransformedComponent = (props: T) => {
    if (
      "children" in props &&
      props.children &&
      Array.isArray(props.children)
    ) {
      if (props.children.length === 1) {
        return <Component {...props}>{props.children[0]}</Component>;
      }
      return (
        <Component {...props}>
          {props.children.map((child, index) => {
            return <React.Fragment key={index}>{child}</React.Fragment>;
          })}
        </Component>
      );
    } else {
      return <Component {...props} />;
    }
  };
  TransformedComponent.displayName = Component.displayName;
  return TransformedComponent;
}

for (const key in components) {
  const Component = components[key as keyof typeof components];
  // @ts-expect-error - TypeScript doesn't like us mutating the components object
  components[key as keyof typeof components] = transform(Component);
}
