import { gql } from 'graphql-tag';

export const schema = gql`
	type User {
		"""
		Unique identifier for the user
		"""
		id: String!
		"""
		Email address of the user
		"""
		email: String!
		"""
		First name of the user
		"""
		firstName: String!
		"""
		Last name of the user
		"""
		lastName: String!
		"""
		URL of the user's avatar
		"""
		avatarUrl: String
		createdAt: String!
		updatedAt: String!
	}
`;
