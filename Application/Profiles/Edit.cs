
using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles;

public class Edit
{
    public class Command : IRequest<Result<Unit>>
    {
        public string DisplayName { get; set; }
        public string Bio { get; set; }
    }

    public class Handler : IRequestHandler<Command, Result<Unit>>
    {
        private readonly DataContext _context;
        private readonly IUserAccessor _userAccessor;
        public Handler(DataContext context, IUserAccessor userAccessor)
        {
            _context = context;
            _userAccessor = userAccessor;
        }


        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername());

            if (user == null) return null;

            user.DisplayName = request.DisplayName ?? user.DisplayName;
            user.Bio = request.Bio ?? user.Bio;

            var result = await _context.SaveChangesAsync() > 0;

            if (!result) return Result<Unit>.Failure("Failed to update profile");

            return Result<Unit>.Success(Unit.Value);
        }
    }

}
