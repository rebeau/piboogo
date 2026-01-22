'use client';

export const isLocalTest = () => {
  if (!isClient()) {
    return;
  }
  if (
    process.env.CUSTOM_ENV === 'development' &&
    window.location.hostname === 'localhost'
  ) {
    console.log('@@@@@@@@@@@@@ isLocalTest @@@@@@@@@@@@@');
    return true;
  }
  return false;
};

export const isMobile = () => {
  if (!isClient()) {
    return;
  }
  const width = window.innerWidth;
  if (OSInfo().osType !== 2 && width >= 600) {
    return false;
  }
  return true;
  /*
  const { userAgent } = navigator;
  if (
    userAgent.match(
      /iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i,
    ) != null ||
    userAgent.match(/LG|SAMSUNG|Samsung/) != null
  ) {
    return true;
  }
  return false;
  */
};

export const isClient = () => {
  if (typeof window !== 'undefined') {
    return true;
  } else {
    return false;
  }
};

export const getBreakpoint = () => {
  if (!isClient()) {
    return;
  }
  const breakpoints = ['base', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'];
  const width = window.innerWidth;
  /*
    base: '0em',
    xs: '300px',
    sm: '480px', // 30em
    md: '768px', // 48em
    lg: '992px', // 62em
    xl: '1280px', // 80em
    '2xl': '1536px', // 96em
    */

  /*
  if (width < 30 * 16) return breakpoints[1]; // sm
  if (width < 48 * 16) return breakpoints[2]; // md
  if (width < 62 * 16) return breakpoints[3]; // lg
  if (width < 80 * 16) return breakpoints[4]; // xl
  if (width < 96 * 16) return breakpoints[5]; // 2xl
  */

  /*
  xs: '300px',
  sm: onlyMobile ? '400px' : '480px', // 30em
  md: onlyMobile ? '500px' : '768px', // 48em
  lg: onlyMobile ? '700px' : '992px', // 62em
  xl: onlyMobile ? '800px' : '1280px', // 80em
  '2xl': '1536px', // 96em
  */

  if (width < 400) return breakpoints[1]; // xs
  if (width < 500) return breakpoints[2]; // sm
  if (width < 700) return breakpoints[3]; // md
  if (width < 800)
    return breakpoints[4]; // lg
  else return breakpoints[5];
};

export const getFontSize = (fontSize, targetWidth = 800) => {
  if (!isClient()) {
    return;
  }
  if (isMobile()) {
    const designWidth = targetWidth;
    const width = window.innerWidth;
    const percent = width / designWidth;
    return `${fontSize * percent}px`;
  } else {
    return `${fontSize / 2}px`;
  }
};

export const getHeight = (h) => {
  if (!isClient()) {
    return;
  }
  const designHeight = 1340;
  const percent = ((h / designHeight) * 100).toFixed(4);
  const temp = `${Number(percent) + 0.47}%`;
  return temp;
};

export const OSInfo = () => {
  if (!isClient()) {
    return;
  }
  const osInfo = {
    osType: null, // 사용자 운영체제(1:web, 2:mobile, 3:web&mobile)
    mobileOsType: null, // 사용자 모바일 운영체제(1:iOS, 2:AOS) - 모바일 사용자만 필수
  };
  const devName = OSInfoDev().toLowerCase();
  const agent = navigator.userAgent.toLowerCase();
  // let agent = 'mozilla/5.0 (Macintosh; intel mac os x 10_14_6) Applewebkit/605.1.15 (KHTML, like gecko) Version/12.1.2 Safari/605.1.15'.toLowerCase()
  if (
    devName.indexOf('macos') > -1 ||
    devName.indexOf('iphone') > -1 ||
    devName.indexOf('ipad') > -1
  ) {
    if (
      agent.indexOf('safari') > -1 ||
      agent.indexOf('naver') > -1 ||
      agent.indexOf('kakaotalk') > -1
    ) {
      osInfo.osType = 3;
    } else {
      osInfo.osType = 2;
    }
    osInfo.mobileOsType = 1;
  } else if (devName.indexOf('android') > -1) {
    if (agent.indexOf('wv') > -1) {
      if (agent.indexOf('naver') > -1 || agent.indexOf('kakaotalk') > -1) {
        osInfo.osType = 3;
      } else {
        osInfo.osType = 2;
      }
    } else {
      osInfo.osType = 3;
    }
    osInfo.mobileOsType = 2;
  } else if (devName.indexOf('macintosh') > -1) {
    const touchTime = `${navigator.maxTouchPoints}`;
    if (touchTime === 5) {
      if (
        agent.indexOf('safari') > -1 ||
        agent.indexOf('naver') > -1 ||
        agent.indexOf('kakaotalk') > -1
      ) {
        osInfo.osType = 3;
      } else {
        osInfo.osType = 2;
      }
      osInfo.mobileOsType = 1;
    } else {
      osInfo.osType = 1;
    }
  } else {
    osInfo.osType = 1;
  }
  return osInfo;
};
const OSInfoDev = () => {
  if (!isClient()) {
    return;
  }
  const agent = navigator.userAgent;
  const AgentUserOs = agent.replace(/ /g, '');
  const OsNo = agent.toLowerCase();
  const os = {
    Linux: /linux/.test(OsNo),
    Unix: /x11/.test(OsNo),
    Mac: /mac/.test(OsNo),
    Windows: /win/.test(OsNo),
  };
  let OSName = null;
  let OSVers = null;
  if (os.Windows) {
    if (AgentUserOs.indexOf('WindowsCE') !== -1) OSName = 'Windows CE';
    else if (AgentUserOs.indexOf('Windows95') !== -1) OSName = 'Windows 95';
    else if (AgentUserOs.indexOf('Windows98') !== -1) {
      if (AgentUserOs.indexOf('Win9x4.90') !== -1)
        OSName = 'Windows Millennium Edition (Windows Me)';
      else OSName = 'Windows 98';
    } else if (AgentUserOs.indexOf('WindowsNT4.0') !== -1)
      OSName = 'Microsoft Windows NT 4.0';
    else if (AgentUserOs.indexOf('WindowsNT5.0') !== -1)
      OSName = 'Windows 2000';
    else if (AgentUserOs.indexOf('WindowsNT5.01') !== -1)
      OSName = 'Windows 2000, Service Pack 1 (SP1)';
    else if (AgentUserOs.indexOf('WindowsNT5.1') !== -1) OSName = 'Windows XP';
    else if (AgentUserOs.indexOf('WindowsNT5.2') !== -1)
      OSName = 'Windows 2003';
    else if (AgentUserOs.indexOf('WindowsNT6.0') !== -1)
      OSName = 'Windows Vista/Server 2008';
    else if (AgentUserOs.indexOf('WindowsNT6.1') !== -1) OSName = 'Windows 7';
    else if (AgentUserOs.indexOf('WindowsNT6.2') !== -1) OSName = 'Windows 8';
    else if (AgentUserOs.indexOf('WindowsNT6.3') !== -1) OSName = 'Windows 8.1';
    else if (AgentUserOs.indexOf('WindowsPhone8.0') !== -1)
      OSName = 'Windows Phone 8.0';
    else if (AgentUserOs.indexOf('WindowsPhoneOS7.5') !== -1)
      OSName = 'Windows Phone OS 7.5';
    else if (AgentUserOs.indexOf('Xbox') !== -1) OSName = 'Xbox 360';
    else if (AgentUserOs.indexOf('XboxOne') !== -1) OSName = 'Xbox One';
    else if (AgentUserOs.indexOf('Win16') !== -1) OSName = 'Windows 3.x';
    else if (AgentUserOs.indexOf('ARM') !== -1) OSName = 'Windows RT';
    else OSName = 'Windows (Unknown)';
    if (AgentUserOs.indexOf('WOW64') !== -1) OSVers = ' 64-bit(s/w 32-bit)';
    else if (AgentUserOs.indexOf('Win64;x64;') !== -1)
      OSVers = ' 64-bit(s/w 64-bit)';
    else if (AgentUserOs.indexOf('Win16') !== -1) OSVers = ' 16-bit';
    else OSVers = ' 32-bit';
  } else if (os.Linux) {
    if (AgentUserOs.indexOf('Android') !== -1) {
      const regex = /Android (.*);.*;\s*(.*)\sBuild/;
      const match = regex.exec(agent);
      if (match) {
        const ver = match[1];
        const devName = match[2];
        return `Android ${ver} ${devName}`;
      }
      return 'Android OS';
    }
    if (AgentUserOs.indexOf('BlackBerry9000') !== -1) OSName = 'BlackBerry9000';
    else if (AgentUserOs.indexOf('BlackBerry9300') !== -1)
      OSName = 'BlackBerry9300';
    else if (AgentUserOs.indexOf('BlackBerry9700') !== -1)
      OSName = 'BlackBerry9700';
    else if (AgentUserOs.indexOf('BlackBerry9780') !== -1)
      OSName = 'BlackBerry9780';
    else if (AgentUserOs.indexOf('BlackBerry9900') !== -1)
      OSName = 'BlackBerry9900';
    else if (AgentUserOs.indexOf('BlackBerry;Opera Mini') !== -1)
      OSName = 'Opera/9.80';
    else if (AgentUserOs.indexOf('Symbian/3') !== -1) OSName = 'Symbian OS3';
    else if (AgentUserOs.indexOf('SymbianOS/6') !== -1) OSName = 'Symbian OS6';
    else if (AgentUserOs.indexOf('SymbianOS/9') !== -1) OSName = 'Symbian OS9';
    else if (AgentUserOs.indexOf('Ubuntu') !== -1) OSName = 'Ubuntu';
    else if (AgentUserOs.indexOf('PDA') !== -1) OSName = 'PDA';
    else if (AgentUserOs.indexOf('NintendoWii') !== -1) OSName = 'Nintendo Wii';
    else if (AgentUserOs.indexOf('PSP') !== -1) OSName = 'PlayStation Portable';
    else if (AgentUserOs.indexOf('PS2;') !== -1) OSName = 'PlayStation 2';
    else if (AgentUserOs.indexOf('PLAYSTATION3') !== -1)
      OSName = 'PlayStation 3';
    else OSName = 'Linux (Unknown)';

    if (AgentUserOs.indexOf('x86_64') !== -1) OSVers = ' 64-bit';
    else if (AgentUserOs.indexOf('i386') !== -1) OSVers = ' 32-bit';
    else if (AgentUserOs.indexOf('IA-32') !== -1) OSVers = ' 32-bit';
    else OSVers = '';
  } else if (os.Unix) {
    OSName = 'UNIX';
  } else if (os.Mac) {
    if (AgentUserOs.indexOf('iPhone') !== -1) {
      if (AgentUserOs.indexOf('iPhoneOS3') !== -1) OSName = 'iPhone OS 3';
      else if (AgentUserOs.indexOf('iPhoneOS4') !== -1) OSName = 'iPhone OS 4';
      else if (AgentUserOs.indexOf('iPhoneOS5') !== -1) OSName = 'iPhone OS 5';
      else if (AgentUserOs.indexOf('iPhoneOS6') !== -1) OSName = 'iPhone OS 6';
      else OSName = 'iPhone';
    } else if (AgentUserOs.indexOf('iPad') !== -1) {
      OSName = 'iPad';
    } else if (AgentUserOs.indexOf('MacOS') !== -1) {
      if (AgentUserOs.indexOf('Macintosh') !== -1) OSName = 'Macintosh';
      else if (
        (AgentUserOs.indexOf('MacOSX10_9') ||
          AgentUserOs.indexOf('MacOSX10.1')) !== -1
      )
        OSName = 'Mac OS X Puma';
      else if (
        (AgentUserOs.indexOf('MacOSX10_9') ||
          AgentUserOs.indexOf('MacOSX10.2')) !== -1
      )
        OSName = 'Mac OS X Jaguar';
      else if (
        (AgentUserOs.indexOf('MacOSX10_9') ||
          AgentUserOs.indexOf('MacOSX10.3')) !== -1
      )
        OSName = 'Mac OS X Panther';
      else if (
        (AgentUserOs.indexOf('MacOSX10_9') ||
          AgentUserOs.indexOf('MacOSX10.4')) !== -1
      )
        OSName = 'Mac OS X Tiger';
      else if (
        (AgentUserOs.indexOf('MacOSX10_9') ||
          AgentUserOs.indexOf('MacOSX10.5')) !== -1
      )
        OSName = 'Mac OS X Leopard';
      else if (
        (AgentUserOs.indexOf('MacOSX10_9') ||
          AgentUserOs.indexOf('MacOSX10.6')) !== -1
      )
        OSName = 'Mac OS X Snow Leopard';
      else if (
        (AgentUserOs.indexOf('MacOSX10_9') ||
          AgentUserOs.indexOf('MacOSX10.7')) !== -1
      )
        OSName = 'Mac OS X Lion';
      else if (
        (AgentUserOs.indexOf('MacOSX10_9') ||
          AgentUserOs.indexOf('MacOSX10.8')) !== -1
      )
        OSName = 'Mac OS X Mountain Lion';
      else if (
        (AgentUserOs.indexOf('MacOSX10_9') ||
          AgentUserOs.indexOf('MacOSX10.9')) !== -1
      )
        OSName = 'Mac OS X Mavericks';
    } else {
      OSName = 'MacOS (Unknown)';
    }
  } else {
    OSName = 'Unknown OS';
  }
  const OSDev = OSName + OSVers;
  return OSDev;
};
