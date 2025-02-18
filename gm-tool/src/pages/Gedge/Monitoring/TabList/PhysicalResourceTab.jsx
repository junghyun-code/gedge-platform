import React, { useState, useEffect, PureComponent } from "react";
import { PanelBox } from "@/components/styles/PanelBox";
import { PanelBoxM } from "@/components/styles/PanelBoxM";
import { PrAreaChart } from "./MonitChart/PhysicalResourceChart";
import { CSelectButtonM } from "@/components/buttons";
import { CIconButton } from "@/components/buttons";
import { observer } from "mobx-react";
import dayjs from "dayjs";
import { monitoringStore } from "@/store";
import {
  unixCurrentTime,
  combinationMetrics,
  LastTimeList,
  IntervalList,
} from "../Utils/MetricsVariableFormatter";

import { ClusterMetricTypes, TargetTypes } from "../Utils/MetricsVariables";

const PsysicalResource = observer(() => {
  const [tabvalue, setTabvalue] = useState(0);
  const [open, setOpen] = useState(false);
  const handleTabChange = (event, newValue) => {
    setTabvalue(newValue);
  };

  const [play, setPlay] = useState(false);
  const [playMetrics, setPlayMetrics] = useState(null);

  const {
    clusterName,
    clusterNames,
    lastTime,
    interval,
    setMetricsLastTime,
    setMetricsInterval,
    loadClusterNames,
    setClusterName,
    loadAllMetrics,
    loadRealAllMetrics,
  } = monitoringStore;

  const clusterNameActionList = clusterNames.map((item) => {
    return {
      name: item,
      onClick: () => {
        setClusterName(item);
        calledMetrics();
        ckeckedInterval();
      },
    };
  });

  const lastTimeActionList = LastTimeList.map((item) => {
    return {
      name: item.name,
      onClick: () => {
        setMetricsLastTime(item);
        calledMetrics();
        ckeckedInterval();
      },
    };
  });

  const intervalTimeActionList = IntervalList.map((item) => {
    return {
      name: item.name,
      onClick: () => {
        setMetricsInterval(item);
        calledMetrics();
        ckeckedInterval();
      },
    };
  });

  const calledMetrics = () => {
    loadAllMetrics(
      TargetTypes.CLUSTER,
      unixCurrentTime(),
      combinationMetrics(ClusterMetricTypes.PHYSICAL_ALL)
    );
  };

  const playCalledMetrics = () => {
    setPlay(true);
    setPlayMetrics(
      setInterval(() => {
        loadRealAllMetrics(
          TargetTypes.CLUSTER,
          unixCurrentTime(),
          combinationMetrics(ClusterMetricTypes.PHYSICAL_ALL)
        );
      }, 5000)
    );
  };

  const stopCalledMetrics = () => {
    setPlay(false);
    clearInterval(playMetrics);
    setPlayMetrics(null);
  };

  const ckeckedInterval = () => (play ? stopCalledMetrics() : null);

  useEffect(() => {
    loadClusterNames(calledMetrics);
    if (clusterNameActionList.length > 0) {
      setClusterName(clusterNameActionList[0]["name"]);
    }
  }, []);

  return (
    <PanelBoxM>
      <div className="panelTitBar panelTitBar_clear">
        <div className="tit">
          <span style={{ marginRight: "10px", color: "white " }}>
            Select Cluster
          </span>
          <CSelectButtonM
            className="none_transform"
            items={clusterNameActionList}
          >
            {clusterName}
          </CSelectButtonM>
        </div>
        <div className="date">
          {dayjs(new Date()).format("YYYY-MM-DD")}
          <CIconButton
            onClick={calledMetrics}
            icon="refresh"
            type="btn1"
            tooltip="Refresh"
            style={{
              marginLeft: "10px",
            }}
          ></CIconButton>
        </div>
      </div>
      <PanelBox
        className="panel_graph"
        style={{ height: "100%", margin: "5px 0 5px 0" }}
      >
        <div className="panelTitBar panelTitBar_clear">
          <div
            className="tit"
            style={{ color: "white ", display: "flex", alignItems: "center" }}
          >
            <span style={{ marginRight: "10px", color: "white " }}>Last :</span>
            <CSelectButtonM
              className="none_transform"
              items={lastTimeActionList}
            >
              {lastTime.name}
            </CSelectButtonM>
            <span
              style={{
                marginLeft: "10px",
                marginRight: "10px",
                color: "white ",
              }}
            >
              Interval :
            </span>
            <CSelectButtonM
              className="none_transform"
              items={intervalTimeActionList}
            >
              {interval.name}
            </CSelectButtonM>
            <div
              style={{
                width: "1104px",
                display: "flex",
                justifyContent: "right",
              }}
            >
              <CIconButton
                onClick={playCalledMetrics}
                icon="play"
                type="btn1"
                tooltip="Play"
                isPlay={play}
              ></CIconButton>
              <CIconButton
                onClick={stopCalledMetrics}
                icon="pause"
                type="btn1"
                tooltip="Pause"
              ></CIconButton>
            </div>
          </div>
        </div>
        <div className="tabN-chart-div-area">
          <PanelBox className="panel_graph tabN-chart-area">
            <div className="tab2-chart-area">
              <div className="tab2-chart">
                <PrAreaChart value={ClusterMetricTypes.CPU_UTIL} />
              </div>
            </div>
          </PanelBox>
          <PanelBox className="panel_graph tabN-chart-area">
            <div className="tab2-chart-area">
              <div className="tab2-chart">
                <PrAreaChart value={ClusterMetricTypes.CPU_USAGE} />
              </div>
            </div>
          </PanelBox>
        </div>
        <div className="tabN-chart-div-area">
          <PanelBox className="panel_graph tabN-chart-area">
            <div className="tab2-chart-area">
              <div className="tab2-chart">
                <PrAreaChart value={ClusterMetricTypes.MEMORY_UTIL} />
              </div>
            </div>
          </PanelBox>
          <PanelBox className="panel_graph tabN-chart-area">
            <div className="tab2-chart-area">
              <div className="tab2-chart">
                <PrAreaChart value={ClusterMetricTypes.MEMORY_USAGE} />
              </div>
            </div>
          </PanelBox>
        </div>
        <div className="tabN-chart-div-area">
          <PanelBox className="panel_graph tabN-chart-area">
            <div className="tab2-chart-area">
              <div className="tab2-chart">
                <PrAreaChart value={ClusterMetricTypes.DISK_UTIL} />
              </div>
            </div>
          </PanelBox>
          <PanelBox className="panel_graph tabN-chart-area">
            <div className="tab2-chart-area">
              <div className="tab2-chart">
                <PrAreaChart value={ClusterMetricTypes.DISK_USAGE} />
              </div>
            </div>
          </PanelBox>
        </div>
        <div className="tabN-chart-div-area">
          <PanelBox className="panel_graph tabN-chart-area">
            <div className="tab2-chart-area">
              <div className="tab2-chart">
                <PrAreaChart value={ClusterMetricTypes.POD_UTIL} />
              </div>
            </div>
          </PanelBox>
          <PanelBox className="panel_graph tabN-chart-area">
            <div className="tab2-chart-area">
              <div className="tab2-chart">
                <PrAreaChart value={ClusterMetricTypes.POD_RUNNING} />
              </div>
            </div>
          </PanelBox>
        </div>
      </PanelBox>
    </PanelBoxM>
  );
});
export default PsysicalResource;
