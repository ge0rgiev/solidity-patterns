// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AddressSet {
    struct SourceSet {
        bool active;
        address next;
    }

    mapping(address => SourceSet) private sources;
    uint256 public sourcesCount;

    address private constant SENTIEL_SOURCE = address(0x1);

    constructor(address[] memory _sources) {
        address currentSource = SENTIEL_SOURCE;

        uint256 sourcesLength = _sources.length;
        for (uint256 i = 0; i < sourcesLength; ) {
            address _source = _sources[i];
            require(
                _source != address(0) &&
                    _source != SENTIEL_SOURCE &&
                    _source != address(this) &&
                    currentSource != _source,
                "AddressSet: INVALID_SOURCE"
            );

            require(
                sources[_source].next == address(0),
                "AddressSet: EXISTING_SOURCE"
            );

            sources[currentSource] = SourceSet({active: true, next: _source});
            currentSource = _source;

            unchecked {
                ++i;
            }
        }

        sources[currentSource] = SourceSet({
            active: true,
            next: SENTIEL_SOURCE
        });
        sourcesCount = sourcesLength;
    }

    function getSources() external view returns (address[] memory) {
        address[] memory _sources = new address[](sourcesCount);

        uint256 index = 0;
        address currentSource = sources[SENTIEL_SOURCE].next;
        while (currentSource != SENTIEL_SOURCE) {
            if (sources[currentSource].active) {
                _sources[index] = currentSource;
                index++;
            }
            currentSource = sources[currentSource].next;
        }
        return _sources;
    }

    function addSource(address _source) external {
        require(
            _source != address(0) &&
                _source != SENTIEL_SOURCE &&
                _source != address(this),
            "AddressSet: INVALID_SOURCE"
        );

        require(
            sources[_source].active == false,
            "AddressSet: ALREADY_ACTIVE_SOURCE"
        );

        sources[_source] = SourceSet({
            active: true,
            next: sources[SENTIEL_SOURCE].next
        });
        sources[SENTIEL_SOURCE].next = _source;

        sourcesCount++;
    }

    function removeSource(address _source) external {
        require(
            _source != address(0) &&
                _source != SENTIEL_SOURCE &&
                _source != address(this),
            "AddressSet: INVALID_SOURCE"
        );

        require(
            sources[_source].next != address(0),
            "AddressSet: NONEXISTENT_SOURCE"
        );

        sources[_source].active = false;

        sourcesCount--;
    }
}

// unchecked { ++i; }
