const FilesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='39'
      height='28'
      viewBox='0 0 39 28'
      fill='none'
      {...props}
    >
      <path
        d='M3.29076 4.75568L9.36003 3.74414V22.1522L6.68938 22.7144C4.90106 23.0909 3.15228 21.9252 2.81175 20.1297L0.621638 8.58187C0.28058 6.78357 1.48531 5.05659 3.29076 4.75568Z'
        stroke='#6900EE'
        strokeWidth='1.08755'
      />
      <path
        d='M34.7733 4.75568L28.7041 3.74414V22.1522L31.3747 22.7144C33.163 23.0909 34.9118 21.9252 35.2523 20.1297L37.4424 8.58187C37.7835 6.78357 36.5788 5.05659 34.7733 4.75568Z'
        stroke='#6900EE'
        strokeWidth='1.08755'
      />
      <g filter='url(#filter0_d_143_11801)'>
        <rect
          x='9.2798'
          y='0.543773'
          width='19.5045'
          height='23.2485'
          rx='2.71886'
          stroke='#6900EE'
          strokeWidth='1.08755'
          shapeRendering='crispEdges'
        />
      </g>
      <path
        d='M21.1979 17.9922C21.6333 18.4932 22.4122 18.4911 22.8444 17.9873L25.6911 14.6689L28.7839 17.9971V21.0732C28.7837 22.5746 27.5666 23.792 26.0651 23.792H11.9987C10.4973 23.792 9.28018 22.5746 9.27997 21.0732V19.1904L16.0261 12.041L21.1979 17.9922Z'
        fill='#DDDAFF'
        stroke='#6900EE'
        strokeWidth='1.08755'
      />
      <circle
        cx='21.5281'
        cy='7.80117'
        r='2.26423'
        fill='#DDDAFF'
        stroke='#6900EE'
        strokeWidth='1.08755'
      />
      <defs>
        <filter
          id='filter0_d_143_11801'
          x='7.1047'
          y='0'
          width='23.8547'
          height='27.5986'
          filterUnits='userSpaceOnUse'
          colorInterpolationFilters='sRGB'
        >
          <feFlood floodOpacity='0' result='BackgroundImageFix' />
          <feColorMatrix
            in='SourceAlpha'
            type='matrix'
            values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
            result='hardAlpha'
          />
          <feOffset dy='1.63132' />
          <feGaussianBlur stdDeviation='0.815659' />
          <feComposite in2='hardAlpha' operator='out' />
          <feColorMatrix
            type='matrix'
            values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0'
          />
          <feBlend
            mode='normal'
            in2='BackgroundImageFix'
            result='effect1_dropShadow_143_11801'
          />
          <feBlend
            mode='normal'
            in='SourceGraphic'
            in2='effect1_dropShadow_143_11801'
            result='shape'
          />
        </filter>
      </defs>
    </svg>
  );
};

export default FilesIcon;