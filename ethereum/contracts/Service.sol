pragma solidity ^0.4.17;

contract ServiceFactory {
    address[] public deployedServices;

    function createService(string serviceName, string serviceDescription) public {
        address newService = new Service(serviceName, serviceDescription);
        deployedServices.push(newService);
    }

    function getDeployedServices() public view returns (address[]) {
        return deployedServices;
    }

    function getMostRatedService() public view returns (address) {
        if (deployedServices.length == 0) {
            return;
        }
        uint maxIndex = 0;
        uint maxValue = 0;
        for(uint i=0; i < deployedServices.length; i++){
            Service currentService = Service(deployedServices[i]);
            uint currentAmountOfRatings = currentService.getReviewCount();
            if (currentAmountOfRatings > maxValue) {
                maxIndex = i;
                maxValue = currentAmountOfRatings;
            }
        }
        return deployedServices[maxIndex];
    }
}

contract Service{
    struct Review {
        address reviewer;
        uint reviewScore;
        string reviewText;
    }

    Review[] public reviews;
    string public name;
    string public description;
    bool public tagged;
    mapping(address=>bool) public reviewers;
    string public avgRating;

    constructor(string serviceName, string serviceDescription) public {
        name = serviceName;
        description = serviceDescription;
        avgRating = "0";
        tagged = false;
    }

    function reverseTaggedStatus() public {
        tagged = !tagged;
    }

    function rate(uint score, string text, string newAverage) public {
        address sender = msg.sender;

        require(!reviewers[sender]);

        Review memory review = Review({
        reviewer: sender,
        reviewScore: score,
        reviewText: text
        });

        setAverageRating(newAverage);
        reviews.push(review);
        reviewers[sender] = true;
    }

    function setAverageRating(string rating) private {
        avgRating = rating;
    }

    function rateAndChangeTag(uint score, string text, string newAverage) public {
        rate(score, text, newAverage);
        reverseTaggedStatus();
    }

    function getReviewCount() public view returns (uint) {
        return reviews.length;
    }
}