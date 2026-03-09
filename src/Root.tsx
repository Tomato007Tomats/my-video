import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { AxosIntro } from "./AxosIntro";
import {
  AxosPortfolioRiskSignalDemo,
  axosPortfolioRiskSignalDemoDuration,
} from "./AxosPortfolioRiskSignalDemo";
import { FloatingAIInputShowcase } from "./FloatingAIInputShowcase";
import { SaaSAgentDemo } from "./SaaSAgentDemo";
import { ScreenRecordingWithClock } from "./ScreenRecordingWithClock";
import { AxosPortfolioIntro } from "./AxosPortfolioIntro";
import { LiquidGlass } from "./LiquidGlass";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MyComp"
        component={MyComposition}
        durationInFrames={60}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="AxosIntro"
        component={AxosIntro}
        durationInFrames={450}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="FloatingAIInputShowcase"
        component={FloatingAIInputShowcase}
        durationInFrames={250}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="SaaSAgentDemo"
        component={SaaSAgentDemo}
        durationInFrames={720}
        fps={60}
        width={1920}
        height={1080}
      />
      <Composition
        id="ScreenRecordingWithClock"
        component={ScreenRecordingWithClock}
        durationInFrames={690}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="AxosPortfolioIntro"
        component={AxosPortfolioIntro}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="LiquidGlass"
        component={LiquidGlass}
        durationInFrames={240}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="AxosPortfolioRiskSignalDemo"
        component={AxosPortfolioRiskSignalDemo}
        durationInFrames={axosPortfolioRiskSignalDemoDuration}
        fps={60}
        width={1920}
        height={1080}
      />
    </>
  );
};
