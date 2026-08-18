package com.rootpilot.rootpilot_backend.dto;

public class KnowledgeGraphNode {

    private String nodeId;
    private String nodeType;
    private String nodeName;
    private int relationshipCount;

    public KnowledgeGraphNode(
            String nodeId,
            String nodeType,
            String nodeName,
            int relationshipCount) {

        this.nodeId = nodeId;
        this.nodeType = nodeType;
        this.nodeName = nodeName;
        this.relationshipCount = relationshipCount;
    }

    public String getNodeId() {
        return nodeId;
    }

    public void setNodeId(String nodeId) {
        this.nodeId = nodeId;
    }

    public String getNodeType() {
        return nodeType;
    }

    public void setNodeType(String nodeType) {
        this.nodeType = nodeType;
    }

    public String getNodeName() {
        return nodeName;
    }

    public void setNodeName(String nodeName) {
        this.nodeName = nodeName;
    }

    public int getRelationshipCount() {
        return relationshipCount;
    }

    public void setRelationshipCount(int relationshipCount) {
        this.relationshipCount = relationshipCount;
    }
}