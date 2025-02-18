import { observer } from "mobx-react";
import { CTextField } from "@/components/textfields";
import FormControl from "@material-ui/core/FormControl";
import { projectStore, claimStore, podStore, workspaceStore } from "@/store";
import styled from "styled-components";
import PodAddContainer from "./PodAddContainer";
import { useEffect, useState } from "react";

const Button = styled.button`
  background-color: #fff;
  border: 1px solid black;
  color: black;
  padding: 10px 35px;
  margin-right: 10px;
  border-radius: 4px;
  /* box-shadow: 0 8px 16px 0 rgb(35 45 65 / 28%); */
`;

const DeleteButton = styled.button`
  margin: 0px 0px 0px 3px;
  overflow: hidden;
  position: relative;
  border: none;
  width: 1.5em;
  height: 1.5em;
  border-radius: 50%;
  background: transparent;
  font: inherit;
  text-indent: 100%;
  cursor: pointer;

  &:hover {
    background: rgba(29, 161, 142, 0.1);
  }

  &:before,
  &:after {
    position: absolute;
    top: 15%;
    left: calc(50% - 0.0625em);
    width: 0.125em;
    height: 70%;
    border-radius: 0.125em;
    transform: rotate(45deg);
    background: currentcolor;
    content: "";
  }

  &:after {
    transform: rotate(-45deg);
  }
`;

const Table = styled.table`
  tbody {
    display: block;
    height: 170px;
    overflow: auto;
  }
  thead,
  tbody tr {
    display: table;
    width: 100%;
    table-layout: fixed;
  }
  thead {
    width: calc(100% - 1em);
  }
`;

const CreatePodStepOne = observer((props) => {
  const { podInfo, setPodInfo, initTargetClusters, removeContainer } = podStore;

  const {
    loadWorkSpaceList,
    workSpaceList,
    loadWorkspaceDetail,
    loadSourceCluster,
    sourceClusterList,
  } = workspaceStore;

  const {
    projectListinWorkspace,
    loadProjectListInWorkspace,
    loadProjectDetail,
    loadProjectList,
    projectLists,
  } = projectStore;

  const { pvClaimListInDeployment, setCheckPVCInPod } = claimStore;

  const [containerIndex, setContainerIndex] = useState(1);
  const [open, setOpen] = useState(false);
  const [prioritytDisable, setPriorityDisable] = useState(true);

  const onChange = (e) => {
    if (e.target.name === "podName") {
      setPodInfo(e.target.name, e.target.value);
    }

    if (e.target.name === "workspace") {
      const selectedWorkspace = workSpaceList.find(
        (workspace) => workspace.workspaceName === e.target.value
      );
      setPodInfo(e.target.name, e.target.value);
      setPodInfo("workspacetag", selectedWorkspace.workspaceTag);
      setPodInfo("workspaceuuid", selectedWorkspace.workspaceUUID);

      loadProjectListInWorkspace(e.target.value);
      loadWorkspaceDetail(e.target.value);
      loadSourceCluster(e.target.value);
    } else if (e.target.name === "volume") {
      setCheckPVCInPod(e.target.value);
    }

    if (e.target.name === "project") {
      setPodInfo(e.target.name, e.target.value);
      loadProjectDetail(e.target.value);

      initTargetClusters(
        sourceClusterList?.map((cluster) => cluster.clusterName)
      );
    }
    if (e.target.name === "claimVolume") {
      const pvc = JSON.parse(e.target.value);
      setCheckPVCInPod(pvc.name, pvc.volume);
      setPodInfo("pvcName", pvc.name);
      setPodInfo("volume", pvc.volume);
    }
  };

  const openAddContainer = (containerIndex) => {
    setContainerIndex(containerIndex);
    setOpen(true);
  };

  const deleteContainer = (e, removeIndex) => {
    e.stopPropagation();
    removeContainer(index);
  };

  useEffect(() => {
    loadWorkSpaceList();
    loadProjectList();
  }, []);

  return (
    <>
      <PodAddContainer
        containerIndex={containerIndex}
        open={open}
        onClose={() => setOpen(false)}
      ></PodAddContainer>

      <div className="step-container">
        <div className="signup-step">
          <div className="step current">
            <span>기본 정보</span>
          </div>
          <div className="arr"></div>
          <div className="step">
            <span>고급 설정</span>
          </div>
          <div className="arr"></div>
          <div className="step">
            <span>스케줄러</span>
          </div>
          <div className="arr"></div>
          <div className="step">
            <span>설정 검토</span>
          </div>
        </div>
      </div>
      <table className="tb_data_new tb_write">
        <tbody>
          <tr>
            <th style={{ width: "200px" }}>
              Pod Name <span className="requried">*</span>
            </th>
            <td colSpan="3">
              <CTextField
                type="text"
                placeholder="Pod Name(영어소문자, 숫자만 가능)"
                className="form_fullWidth"
                name="podName"
                onChange={onChange}
                value={podInfo.podName}
              />
            </td>
          </tr>
          <tr>
            <th>
              Workspace <span className="requried">*</span>
            </th>
            <td colSpan="3">
              <FormControl className="form_fullWidth">
                <select
                  name="workspace"
                  onChange={onChange}
                  value={podInfo.workspace}
                >
                  <option value={""} selected disabled hidden>
                    Select Workspace
                  </option>
                  {workSpaceList.map((workspace) => (
                    <option
                      key={workspace.workspaceUUID}
                      value={workspace.workspaceName}
                    >
                      {workspace.workspaceName}
                    </option>
                  ))}
                </select>
              </FormControl>
            </td>
          </tr>

          <tr>
            <th>
              Project <span className="requried">*</span>
            </th>
            <td colSpan="3">
              <FormControl className="form_fullWidth">
                <select
                  disabled={!podInfo.workspace}
                  name="project"
                  onChange={onChange}
                  value={podInfo.project}
                >
                  <option value={""} selected hidden disabled>
                    Select Project
                  </option>
                  {projectListinWorkspace ? (
                    projectListinWorkspace?.map((project) => (
                      <option value={project.projectName}>
                        {project.projectName}
                      </option>
                    ))
                  ) : (
                    <option value={""}>No Data</option>
                  )}
                </select>
              </FormControl>
            </td>
          </tr>

          <tr>
            <th>ClaimVolume</th>
            <td colSpan="3">
              <Table className="tb_data_new">
                <thead>
                  <tr>
                    <th style={{ textAlign: "center", width: "7%" }}></th>
                    <th style={{ textAlign: "center" }}>Name</th>
                    <th style={{ textAlign: "center" }}>Namespace</th>
                    <th style={{ textAlign: "center" }}>cluster</th>
                    <th style={{ textAlign: "center" }}>volume</th>
                  </tr>
                </thead>
                <tbody className="tb_data_nodeInfo" style={{ height: "105px" }}>
                  {pvClaimListInDeployment ? (
                    pvClaimListInDeployment?.map((pvc) => (
                      <tr>
                        <td style={{ textAlign: "center", width: "7%" }}>
                          <input
                            type="radio"
                            checked={podInfo.pvcName === pvc.name}
                            name="claimVolume"
                            onChange={onChange}
                            value={JSON.stringify(pvc)}
                          />
                        </td>
                        <td>{pvc.name}</td>
                        <td>{pvc.namespace}</td>
                        <td>{pvc.clusterName}</td>
                        <td>{pvc.volume ? pvc.volume : ""}</td>
                      </tr>
                    ))
                  ) : (
                    <div style={{ textAlign: "center", padding: "43px 0" }}>
                      <tr>No Data</tr>
                    </div>
                  )}
                </tbody>
              </Table>
            </td>
          </tr>

          <tr>
            <th>
              Containers <span className="requried">*</span>
            </th>
            <td>
              <Button
                style={{ marginBottom: "2px" }}
                onClick={() => openAddContainer(-1)}
              >
                + Add Container
              </Button>
              <div>
                {podInfo.containers.map((container, index) => (
                  <Button
                    style={{ marginTop: "2px", marginBottom: "2px" }}
                    onClick={() => openAddContainer(index)}
                  >
                    {container.containerName}
                    <DeleteButton onClick={(e) => removeContainer(e, index)}>
                      x
                    </DeleteButton>
                  </Button>
                ))}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
});

export default CreatePodStepOne;
