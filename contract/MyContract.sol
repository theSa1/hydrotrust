// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract HydrogenSubsidyContract {
    uint256 public totalProducedHydrogen = 0;
    uint256 public totalSubsidyPaid = 0;
    uint256 public nextMilestoneId = 0;

    struct Milestone {
        uint256 id;
        uint256 hydrogenRequired;
        uint256 subsidyAmount;
        bool isClaimed;
        uint256 claimedAt;
    }

    mapping(uint256 => Milestone) public milestones;
    uint256[] public milestoneIds;

    address public company;
    address public government;
    address public oracle;

    bool public contractActive = true;

    // Modifiers
    modifier onlyOracle() {
        require(msg.sender == oracle, "Only oracle can call this function");
        _;
    }

    modifier onlyGovernment() {
        require(
            msg.sender == government,
            "Only government can call this function"
        );
        _;
    }

    modifier onlyCompany() {
        require(msg.sender == company, "Only company can call this function");
        _;
    }

    modifier contractIsActive() {
        require(contractActive, "Contract is not active");
        _;
    }

    modifier validAddress(address _addr) {
        require(_addr != address(0), "Invalid address: zero address");
        _;
    }

    // Events
    event MilestoneCreated(
        uint256 indexed milestoneId,
        uint256 hydrogenRequired,
        uint256 subsidyAmount
    );
    event MilestoneAchieved(
        uint256 indexed milestoneId,
        uint256 hydrogenProduced,
        uint256 subsidyAmount
    );
    event SubsidyPaid(
        uint256 indexed milestoneId,
        address indexed company,
        uint256 amount
    );
    event HydrogenDataSubmitted(uint256 totalProduced, address indexed oracle);
    event OracleUpdated(address indexed oldOracle, address indexed newOracle);
    event ContractDeactivated();

    constructor(
        address _company,
        address _oracle,
        uint256[] memory _hydrogenRequirements,
        uint256[] memory _subsidyAmounts
    ) validAddress(_company) validAddress(_oracle) {
        require(
            _hydrogenRequirements.length == _subsidyAmounts.length,
            "Mismatched array lengths"
        );
        require(
            _hydrogenRequirements.length > 0,
            "Must have at least one milestone"
        );

        company = _company;
        oracle = _oracle;
        government = msg.sender;

        // Create all milestones during deployment
        for (uint256 i = 0; i < _hydrogenRequirements.length; i++) {
            require(
                _hydrogenRequirements[i] > 0,
                "Hydrogen requirement must be positive"
            );
            require(_subsidyAmounts[i] > 0, "Subsidy amount must be positive");
            _createMilestone(_hydrogenRequirements[i], _subsidyAmounts[i]);
        }
    }

    function createMilestone(
        uint256 _hydrogenRequired,
        uint256 _subsidyAmount
    ) external onlyGovernment contractIsActive {
        require(_hydrogenRequired > 0, "Hydrogen requirement must be positive");
        require(_subsidyAmount > 0, "Subsidy amount must be positive");
        _createMilestone(_hydrogenRequired, _subsidyAmount);
    }

    function updateOracle(
        address _newOracle
    ) external onlyGovernment validAddress(_newOracle) {
        address oldOracle = oracle;
        oracle = _newOracle;
        emit OracleUpdated(oldOracle, _newOracle);
    }

    function deactivateContract() external onlyGovernment {
        contractActive = false;
        emit ContractDeactivated();
    }

    // Oracle functions
    function submitHydrogenData(
        uint256 _hydrogenProduced
    ) external onlyOracle contractIsActive {
        require(
            _hydrogenProduced >= totalProducedHydrogen,
            "Cannot decrease hydrogen production"
        );

        totalProducedHydrogen = _hydrogenProduced;
        emit HydrogenDataSubmitted(_hydrogenProduced, msg.sender);

        _evaluateAllMilestones();
    }

    // Internal functions
    function _createMilestone(
        uint256 _hydrogenRequired,
        uint256 _subsidyAmount
    ) internal {
        uint256 milestoneId = nextMilestoneId++;

        milestones[milestoneId] = Milestone({
            id: milestoneId,
            hydrogenRequired: _hydrogenRequired,
            subsidyAmount: _subsidyAmount,
            isClaimed: false,
            claimedAt: 0
        });

        milestoneIds.push(milestoneId);

        emit MilestoneCreated(milestoneId, _hydrogenRequired, _subsidyAmount);
    }

    function _evaluateAllMilestones() internal {
        for (uint256 i = 0; i < milestoneIds.length; i++) {
            uint256 milestoneId = milestoneIds[i];
            Milestone storage milestone = milestones[milestoneId];

            if (
                !milestone.isClaimed &&
                totalProducedHydrogen >= milestone.hydrogenRequired
            ) {
                emit MilestoneAchieved(
                    milestoneId,
                    totalProducedHydrogen,
                    milestone.subsidyAmount
                );
                emit SubsidyPaid(milestoneId, company, milestone.subsidyAmount);
                milestone.claimedAt = block.timestamp;
                milestone.isClaimed = true;
            }
        }
    }

    // View functions
    function getMilestoneCount() external view returns (uint256) {
        return milestoneIds.length;
    }

    function getAllMilestones() external view returns (Milestone[] memory) {
        Milestone[] memory allMilestones = new Milestone[](milestoneIds.length);
        for (uint256 i = 0; i < milestoneIds.length; i++) {
            allMilestones[i] = milestones[milestoneIds[i]];
        }
        return allMilestones;
    }

    function getClaimableMilestones() external view returns (uint256[] memory) {
        uint256 count = 0;

        // First pass: count claimable milestones
        for (uint256 i = 0; i < milestoneIds.length; i++) {
            uint256 milestoneId = milestoneIds[i];
            if (
                !milestones[milestoneId].isClaimed &&
                totalProducedHydrogen >=
                milestones[milestoneId].hydrogenRequired
            ) {
                count++;
            }
        }

        // Second pass: populate array
        uint256[] memory claimable = new uint256[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < milestoneIds.length; i++) {
            uint256 milestoneId = milestoneIds[i];
            if (
                !milestones[milestoneId].isClaimed &&
                totalProducedHydrogen >=
                milestones[milestoneId].hydrogenRequired
            ) {
                claimable[index] = milestoneId;
                index++;
            }
        }

        return claimable;
    }
}
