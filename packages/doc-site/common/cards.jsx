
import CloudscapeCards from "@cloudscape-design/components/cards";
import CloudscapeLink from "@cloudscape-design/components/link";
import CloudscapeIcon from "@cloudscape-design/components/icon";

export const IntroductionNextStepCards = () => {
  return (
    <CloudscapeCards
      ariaLabels={{
        itemSelectionLabel: (e, t) => `select ${t.name}`,
        selectionGroupLabel: "Item selection"
      }}
      cardDefinition={{
        sections: [
          {
            id: "icon",
            content: item => (
              <CloudscapeIcon name={item.icon} />
            )
          },
          {
            id: "title",
            content: item => (
              <a href={item.link}>
                <strong>{item.title}</strong>
              </a>
            )
          },
          {
            id: "description",
            content: item => item.description
          }
        ]
      }}
      cardsPerRow={[
        { cards: 1 },
        { minWidth: 500, cards: 4 }
      ]}
      items={[
        {
          icon: "download",
          title: "Installation",
          link: "/?path=/docs/overview-getting-started--docs#step-1-install-the-required-dependencies",
          description: "Add iot-app-kit UI to your application with a few commands."
        },
        {
          icon: "insert-row",
          title: "Usage",
          link: "/?path=/docs/overview-getting-started--docs#step-2-initialize-the-aws-iot-sitewise-source",
          description: "Learn the basics about iot-app-kit components."
        },
        {
          icon: "filter",
          title: "Data Sources",
          link: "/?path=/docs/data-sources-aws-iot-sitewise--docs",
          description: "The IoT App KiT data sources helps to query your IoT data"
        },
        {
          icon: "edit",
          title: "Customizing components",
          link: "/?path=/docs/core-styles--docs",
          description: "Learn about the available customization methods."
        },
      ]}
      loadingText="Loading resources"
      empty={`No resources`}
      />
  );
}

export const IntroductionSelectedDemosCards = () => {
  return (
    <CloudscapeCards
      ariaLabels={{
        itemSelectionLabel: (e, t) => `select ${t.name}`,
        selectionGroupLabel: "Item selection"
      }}
      cardDefinition={{
        header: item => item.title,
        sections: [
          {
            id: "name",
            content: item => (
              <CloudscapeLink href={item.link} >
                <img
                  style={{ height: "150px" }}
                  src={item.image}
                  alt="placeholder"
                />
              </CloudscapeLink>
            )
          },
          {
            id: "description",
            content: item => (
              <>
                {item.description}&nbsp;
                <CloudscapeLink
                  href={item.link}
                >Learn more</CloudscapeLink>
              </>
            )
          }
        ]
      }}
      cardsPerRow={[
        { cards: 1 },
        { minWidth: 500, cards: 3 }
      ]}
      items={[
        {
          name: "Dashboard",
          image: "/assets/DashboardPreview.jpg",
          title: "Dashboard",
          link: "/?path=/docs/components-dashboard--docs",
          description: "Dashboard component allows you to easily create, modify, view, and organize widgets for a tailored experience to monitor your IoT data."
        },
        {
          name: "KPI",
          image: "/assets/KPIPreview.png",
          title: "KPI",
          link: "/?path=/docs/components-kpi--docs",
          description: "The Key Performance Indicator (KPI) component provides a compact representation when you need an overview of your asset properties. This overview provides critical insights into the overall performance of your devices, equipment, and processes."
        },
        {
          name: "Chart",
          image: "/assets/ChartPreview.png",
          title: "Chart",
          link: "/?path=/docs/components-chart--docs",
          description: "The chart component is a way to visualize and navigate time series data from one or more data sources.Chart supports a rich set of features including trend cursors, thresholds, high performance live-streaming and smooth syncing across other IoT App Kit components."
        },
        {
          name: "Gauge",
          image: "/assets/GaugePreview.png",
          title: "Gauge",
          link: "/?path=/docs/components-gauge--docs",
          description: "The Gauge component provides a compact representation of an overview of your asset properties. Visualize critical insights into the overall performance of your devices, equipment, or processes."
        },
        {
          name: "Status timeline",
          image: "/assets/StatusTimelinePreview.png",
          title: "Status timeline",
          link: "/?path=/docs/components-statustimeline--docs",
          description: "The status timeline component provides a way to visualize and navigate time series data from one or more data sources. Status timeline supports a rich set of features including alarms, thresholds, high performance live-streaming."
        },
        {
          name: "SceneViewer",
          image: "/assets/SceneViewerPreview.png",
          title: "SceneViewer",
          link: "/?path=/docs/components-sceneviewer--docs",
          description: "The SceneViewer component renders a specified AWS IoT TwinMaker scene for viewing experience. It renders assets including .svg and .hdr files."
        },
      ]}
      loadingText="Loading resources"
      empty={`No resources`}
      />
  );
}
