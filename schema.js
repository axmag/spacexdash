const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
  GraphQLSchema,
  GraphQLUnionType
} = require("graphql");

const axios = require("axios");

// Launch Type
const LaunchType = new GraphQLObjectType({
  name: "Launch",
  fields: () => ({
    flight_number: { type: GraphQLInt },
    mission_name: { type: GraphQLString },
    launch_year: { type: GraphQLString },
    launch_date_local: { type: GraphQLString },
    launch_success: { type: GraphQLBoolean },
    rocket: { type: RocketType },
    links: { 
      type: LinksType
    },
    details: {type: GraphQLString}
  })
});

const LinksType = new GraphQLObjectType({
  name: "Links",
  fields: () => ({
    mission_patch: {type: GraphQLString},
    flickr_images: {type: GraphQLList(GraphQLString)}
  })
})

// Rocket Type
const RocketType = new GraphQLObjectType({
  name: "Rocket",
  fields: () => ({
    rocket_id: { type: GraphQLString },
    rocket_name: { type: GraphQLString },
    rocket_type: { type: GraphQLString }
  })
});


// Queries 

const launch = {
  type: LaunchType,
  args: {
    flight_number: { type: GraphQLInt }
  },
  resolve(parent, args) {
    return axios
      .get(`https://api.spacexdata.com/v3/launches/${args.flight_number}`)
      .then(res => res.data);
  }
};

const launches = {
  type: new GraphQLList(LaunchType),
  resolve(parent, args) {
    return axios
      .get("https://api.spacexdata.com/v3/launches")
      .then(res => res.data);
  }
};

// Root Query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {launches,launch}
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
