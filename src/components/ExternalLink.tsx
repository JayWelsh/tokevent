import React, { HTMLProps, useCallback } from 'react'
import styled from 'styled-components'

const StyledLink = styled.a`
  text-decoration: none;
  cursor: pointer;
  font-weight: 500;

  color: inherit;

  :hover {
    text-decoration: underline;
  }

  :focus {
    outline: none;
    text-decoration: underline;
  }

  :active {
    text-decoration: none;
  }
`

export function ExternalLink({
    target = '_blank',
    href,
    rel = 'noopener noreferrer',
    ...rest
  }: Omit<HTMLProps<HTMLAnchorElement>, 'as' | 'ref' | 'onClick'> & { href: string }) {
    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLAnchorElement>) => {
        // don't prevent default, don't redirect if it's a new tab
        if (target === '_blank' || event.ctrlKey || event.metaKey) {
            // Nothing
        } else {
          event.preventDefault()
        }
      },
      [target]
    )
    return <StyledLink target={target} rel={rel} href={href} onClick={handleClick} {...rest} />
}