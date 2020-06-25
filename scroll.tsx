import React, { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'

interface ScrollOptions {
  clientHeight: number
  scrollBarHeight: number
  scrollContent: HTMLElement
  scrollBar: HTMLElement
}

interface Scroll {
  children: JSX.Element[]
  width?: number
  height?: number
  barHeight?: number
  barWidth?: number
  barStyle?: React.CSSProperties
  barClassName?: string
  barTrackStyle?: React.CSSProperties
  barTrackClassName?: string
  contentStyle?: React.CSSProperties
  contentClassName?: string
}

const Scroll = ({
  children,
  height = 300,
  barWidth = 20,
  barHeight = 50,
  width = 300,
  barClassName,
  barStyle = {},
  barTrackClassName,
  barTrackStyle = {},
  contentClassName,
  contentStyle = {}
}: Scroll) => {
  const scrollBarRef = useRef<HTMLDivElement>()
  const scrollContentRef = useRef<HTMLDivElement>()
  useEffect(() => {
    registerScroll({
      scrollContent: scrollContentRef.current,
      scrollBar: scrollBarRef.current,
      scrollBarHeight: barHeight,
      clientHeight: height
    })
  }, [])

  return <div style={{ display: 'flex' }}>
    <div className={contentClassName} ref={scrollContentRef} style={{
      width: width + 'px',
      height: height + 'px',
      overflow: 'hidden',
      ...contentStyle
    }}>
      {children}
    </div>
    <div className={barTrackClassName} style={{
      position: 'relative',
      width: barWidth + 'px',
      backgroundColor: 'black',
      ...barTrackStyle
    }}>
      <div className={barClassName} ref={scrollBarRef} style={{
        width: '100%',
        height: barHeight + 'px',
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: 'green',
        ...barStyle
      }}></div>
    </div>
  </div>
}

function registerScroll({
  scrollBarHeight,
  clientHeight,
  scrollBar,
  scrollContent
}: ScrollOptions) {
  let isScrolling = false;
  let previousClientY = 0;
  const barMoveLength = clientHeight - scrollBarHeight;
  const contentMoveLength = scrollContent.scrollHeight - clientHeight;

  scrollBar.addEventListener("mousedown", (e) => {
    isScrolling = true;
    previousClientY = e.clientY;
    document.body.classList.add("unselectable");
  });

  document.addEventListener("mouseup", () => {
    isScrolling = false;
    document.body.classList.remove("unselectable");
  });

  document.addEventListener("mousemove", (e) => {
    if (isScrolling) {
      scrollTo((e.clientY - previousClientY) * contentMoveLength / barMoveLength);
      previousClientY = e.clientY;
    }
  });

  if (navigator.userAgent.indexOf("Firefox") < 0) {
    scrollContent.addEventListener("mousewheel", (e) => {
      scrollTo(-e['wheelDelta'])
    });
  } else {
    scrollContent.addEventListener("DOMMouseScroll", (e) => {
      scrollTo(e['detail'] * 30)
    });
  }

  function scrollTo(top: number) {
    top += scrollContent.scrollTop
    if (top < 0) {
      scrollContent.scrollTop = 0;
    } else if (top > contentMoveLength) {
      scrollContent.scrollTop = contentMoveLength;
    } else {
      scrollContent.scrollTop = top;
    }

    const barDownDistance = scrollContent.scrollTop * barMoveLength / contentMoveLength;
    scrollBar.style.top = barDownDistance + "px";
  }

}


const App = () => {
  return <Scroll
    width={200}
    height={400}
    barStyle={{ borderRadius: '0.5rem', backgroundColor: 'lightblue' }}
    barTrackStyle={{ backgroundColor: 'grey' }}
    contentStyle={{ backgroundColor: '#c1dbc7' }}
  >
    <div className="item">233</div>
    <div className="item">233</div>
    <div className="item">233</div>
    <div className="item">233</div>
    <div className="item">233</div>
    <div className="item">233</div>
    <div className="item">233</div>
    <div className="item">233</div>
    <div className="item">233</div>
    <div className="item">233</div>
    <div className="item">233</div>
    <div className="item">233</div>
  </Scroll>
}

ReactDOM.render(<App />,
  document.getElementById('root'))