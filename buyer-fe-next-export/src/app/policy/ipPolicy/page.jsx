'use client';

import useDevice from '@/hooks/useDevice';
import { Box, Center, Textarea } from '@chakra-ui/react';

const IpPolicy = () => {
  const data = `
PIBOOGO, Intellectual Property (IP) Policy

Last Updated: June 1, 2025


1. Ownership of Content
All content on the PIBOOGO platform—including, but not limited to, product images, descriptions, logos, graphics, software, designs, videos, and trademarks—is the property of PIBOOGO or its authorized suppliers and is protected by U.S. and international copyright, trademark, and other intellectual property laws.
You may not use, reproduce, modify, publish, or distribute any content from our platform without express written permission from PIBOOGO or the original rights holder.

2. Vendor & Brand Responsibility
Vendors and brand partners are responsible for ensuring that all content, images, and product information they upload or provide to PIBOOGO do not infringe on any third-party intellectual property rights. By submitting content, you confirm that:
You own the IP rights or have legal authorization to use the content.
The content does not infringe on the copyrights, trademarks, or patents of others.
You grant PIBOOGO a non-exclusive, royalty-free license to use, display, and distribute the content for platform-related purposes.

3. DMCA Compliance and Takedown Procedure
PIBOOGO complies with the Digital Millennium Copyright Act (DMCA). If you believe your intellectual property has been used on our platform in a way that constitutes copyright or trademark infringement, please submit a written notice to:
IP Compliance Officer
PIBOOGO Inc.
2875 W 7TH , Los Angeles California, USA
Email: rebeau.claire@gmail.com
Your notice must include:
A description of the copyrighted or trademarked work being infringed
The specific URL or location of the infringing content on PIBOOGO
Your name, address, telephone number, and email
A statement that you have a good faith belief that the use is unauthorized
A statement, under penalty of perjury, that the information is accurate and that you are authorized to act on behalf of the rights holder
Your physical or electronic signature

4. Counter Notice
If content has been removed based on an IP claim, the uploader may submit a counter notice under the DMCA. PIBOOGO will review the dispute and act accordingly.

5. Termination of Repeat Infringers
PIBOOGO reserves the right to suspend or terminate accounts of users or vendors who repeatedly infringe on intellectual property rights.

6. Contact Us
If you have any questions about these Terms, please contact PIBOOGO at: rebeau.claire@gmail.com
`;

  const { isMobile } = useDevice();
  return (
    <Box w={'100%'} bg={'#8C644212'}>
      <Center>
        <Textarea
          maxW={isMobile(true) ? '100%' : '50%'}
          readOnly
          border={0}
          h={'100vh'}
          resize={'none'}
          overflowY={'auto'}
          color={'#556A7E'}
          fontSize={'1rem'}
          fontWeight={500}
          lineHeight={'1.75rem'}
          value={data}
        />
      </Center>
    </Box>
  );
};

export default IpPolicy;
