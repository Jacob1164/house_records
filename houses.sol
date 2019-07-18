pragma solidity ^0.4.24;

contract Application {
    function Application() public {}
    enum Assets {
        User,
        House
    }
    Assets _create_user = Assets.User;
    Assets _improvement = Assets.House;
    Assets _house_sale = Assets.House;
    Assets _appraisal = Assets.House;
    Assets _accident = Assets.House;
    Assets _new_house = Assets.House;

    function create_user (
        string assetId,
        string username,
        string password,
        string first,
        string last,
        string role,
        string email)
    public {}

    function improvement (
        string assetId,
        string improvement,
        string notes,
        string date,
        int256 value_added,
        string bedrooms,
        string bathrooms,
        string area,
        string acres)
    public {}

    function house_sale (
        string assetId,
        string prev_owner,
        string new_owner,
        string real_estate_agent,
        int256 price,
        string date)
    public {}

    function appraisal (
        string assetId,
        string inspector,
        int256 value,
        string date,
        string notes)
    public {}

    function accident (
        string assetId,
        string incident,
        string notes,
        string owner,
        string date,
        string insurance_agent,
        int256 estimated_damages)
    public {}

    function new_house (
        string assetId,
        string addresss,
        string date,
        string builder,
        int256 lat,
        int256 lng,
        int256 lat_neg,
        int256 lng_neg,
        string bedrooms,
        string bathrooms,
        string area,
        string acres)
    public {}
}
