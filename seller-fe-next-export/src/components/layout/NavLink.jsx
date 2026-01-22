'use client';

import NextLink from 'next/link';
import { Link } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';

const NavLink = (props) => {
  const { href, children, w = '100%' } = props;
  const pathName = usePathname();

  return (
    <Link
      as={NextLink}
      href={href}
      bg={pathName === href ? '#1B2B65' : 'transparent'}
      w={w}
      _hover={{}}
    >
      {children}
    </Link>
  );
};

export default NavLink;
