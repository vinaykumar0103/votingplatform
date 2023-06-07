// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract VotingPlatform is ReentrancyGuard {
    struct Voter {
        bool isRegistered;
        bool hasVoted;
    }

    struct Option {
        string name;
        uint256 voteCount;
    }

    struct Topic {
        address creator;
        string question;
        uint256 expiryTime;
        Option[] options;
        mapping(address => Voter) voters;
    }

    mapping(address => mapping(uint256 => Topic)) private topics;
    mapping(address => uint256) private topicCount;
    mapping(address => bool) private lock;

    modifier CustomNonReentrant() {
        require(!lock[msg.sender], "Reentrant call");
        lock[msg.sender] = true;
        _;
        lock[msg.sender] = false;
    }

    modifier onlyTopicCreator(address _creator, uint256 _topicIndex) {
        require(
            msg.sender == topics[_creator][_topicIndex].creator,
            "Only the topic creator can perform this action"
        );
        _;
    }

    modifier onlyRegisteredVoter(address _creator, uint256 _topicIndex) {
        require(
            topics[_creator][_topicIndex].voters[msg.sender].isRegistered,
            "You are not a registered voter for this topic"
        );
        _;
    }

    function createTopic(
        string memory _question,
        uint256 _expiryTime
    ) external nonReentrant {
        uint256 topicIndex = topicCount[msg.sender];
        Topic storage newTopic = topics[msg.sender][topicIndex];
        newTopic.creator = msg.sender;
        newTopic.question = _question;
        newTopic.expiryTime = _expiryTime;

        topicCount[msg.sender] += 1;
    }

    function createOption(
        address _creator,
        uint256 _topicIndex,
        string memory _optionName
    ) external nonReentrant onlyTopicCreator(_creator, _topicIndex) {
        Topic storage topic = topics[_creator][_topicIndex];
        Option memory newOption;
        newOption.name = _optionName;
        topic.options.push(newOption);
    }

    function registerVoter(
        address _creator,
        uint256 _topicIndex
    ) external nonReentrant {
        Topic storage topic = topics[_creator][_topicIndex];
        require(
            !topic.voters[msg.sender].isRegistered,
            "Voter is already registered for this topic"
        );

        topic.voters[msg.sender].isRegistered = true;
    }

    function allowVoter(
        address _creator,
        uint256 _topicIndex,
        address _voter
    ) external nonReentrant onlyTopicCreator(_creator, _topicIndex) {
        Topic storage topic = topics[_creator][_topicIndex];
        require(
            block.timestamp < topic.expiryTime,
            "Voting has expired for this topic"
        );

        topic.voters[_voter].isRegistered = true;
    }

    function rejectVoter(
        address _creator,
        uint256 _topicIndex,
        address _voter
    ) external onlyTopicCreator(_creator, _topicIndex) {
        Topic storage topic = topics[_creator][_topicIndex];
        require(
            block.timestamp < topic.expiryTime,
            "Voting has expired for this topic"
        );

        topic.voters[_voter].isRegistered = false;
    }

    function vote(
        address _creator,
        uint256 _topicIndex,
        uint256 _optionIndex
    ) external nonReentrant onlyRegisteredVoter(_creator, _topicIndex) {
        Topic storage topic = topics[_creator][_topicIndex];
        require(
            !topic.voters[msg.sender].hasVoted,
            "Voter has already voted for this topic"
        );
        require(_optionIndex < topic.options.length, "Invalid option index");

        topic.options[_optionIndex].voteCount++;
        topic.voters[msg.sender].hasVoted = true;
    }

    function getOptionDetails(
        address _creator,
        uint256 _topicIndex,
        uint256 _optionIndex
    ) external view returns (string memory optionName, uint256 voteCount) {
        Topic storage topic = topics[_creator][_topicIndex];
        Option storage option = topic.options[_optionIndex];
        optionName = option.name;
        voteCount = option.voteCount;
    }

    function hasVoted(
        address _creator,
        uint256 _topicIndex
    ) external view returns (bool) {
        return topics[_creator][_topicIndex].voters[msg.sender].hasVoted;
    }

    function isRegistered(
        address _creator,
        uint256 _topicIndex
    ) external view returns (bool) {
        return topics[_creator][_topicIndex].voters[msg.sender].isRegistered;
    }
}
